#!/usr/bin/env node

/**
 * 🗄️ Script de Normalização do Banco de Dados - Merenda Smart Flow
 * 
 * Este script executa todas as migrations para normalizar o banco de dados,
 * criando tabelas normalizadas para segmentos, períodos e relacionamentos N:N.
 * 
 * ✅ Funciona mesmo se as migrations já foram executadas anteriormente
 * ✅ Detecta automaticamente quais migrations precisam ser executadas
 * ✅ Trata erros esperados (dados duplicados, tabelas existentes)
 * 
 * Uso: 
 *   node scripts/run-migrations.js
 *   npm run migrate
 *   ./run-migrations.sh (Linux/Mac/Git Bash)
 *   ./run-migrations.ps1 (PowerShell)
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

class MigrationRunner {
    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432
        });
        
        this.migrationsDir = path.join(__dirname, '..', 'migrations');
    }

    async checkConnection() {
        console.log('🔌 Testando conexão com o banco de dados...');
        try {
            await this.pool.query('SELECT 1');
            console.log('✅ Conexão estabelecida com sucesso!\n');
            return true;
        } catch (error) {
            console.error('❌ Erro de conexão:', error.message);
            console.log('💡 Verifique as credenciais no arquivo .env\n');
            return false;
        }
    }

    async checkIfMigrationNeeded(fileName) {
        try {
            // Verificar se as mudanças da migration já existem
            switch (fileName) {
                case '001_create_segmento_table.sql':
                    const segmentoExists = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'segmento')"
                    );
                    return !segmentoExists.rows[0].exists;
                
                case '002_create_periodo_lancamento_table.sql':
                    const periodoExists = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'periodo_lancamento')"
                    );
                    return !periodoExists.rows[0].exists;
                
                case '003_create_escola_segmento_table.sql':
                    const escolaSegmentoExists = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'escola_segmento')"
                    );
                    return !escolaSegmentoExists.rows[0].exists;
                
                case '004_migrate_escola_segmentos.sql':
                    const hasData = await this.pool.query('SELECT COUNT(*) FROM escola_segmento');
                    return parseInt(hasData.rows[0].count) === 0;
                
                case '005_alter_estoque_add_columns.sql':
                    const hasColumns = await this.pool.query(`
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_name = 'estoque' AND column_name IN ('id_estoque', 'id_periodo', 'id_segmento')
                    `);
                    return parseInt(hasColumns.rows[0].count) !== 3;
                
                case '006_migrate_estoque_segmentos.sql':
                    const hasMigratedData = await this.pool.query(
                        'SELECT COUNT(*) FROM estoque WHERE id_segmento IS NOT NULL'
                    );
                    return parseInt(hasMigratedData.rows[0].count) === 0;
                
                case '007_add_estoque_constraints.sql':
                    const hasConstraints = await this.pool.query(`
                        SELECT COUNT(*) FROM pg_constraint 
                        WHERE conrelid = 'estoque'::regclass AND conname LIKE 'fk_estoque_%'
                    `);
                    return parseInt(hasConstraints.rows[0].count) === 0;
                
                case '008_create_indexes.sql':
                    const hasIndexes = await this.pool.query(`
                        SELECT COUNT(*) FROM pg_indexes 
                        WHERE tablename IN ('segmento', 'escola_segmento', 'estoque', 'periodo_lancamento')
                        AND indexname NOT LIKE '%_pkey'
                    `);
                    return parseInt(hasIndexes.rows[0].count) < 5;

                case '009_create_password_reset_otp_table.sql':
                    const otpTableExists = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'password_reset_otp')"
                    );
                    return !otpTableExists.rows[0].exists;

                case '010_cleanup_estoque_table.sql':
                    const hasOldColumn = await this.pool.query(`
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_name = 'estoque' AND column_name = 'segmento_estoque'
                    `);
                    return parseInt(hasOldColumn.rows[0].count) > 0;

                case '011_remove_escola_segmento_column.sql':
                    const hasEscolaSegmentoColumn = await this.pool.query(`
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_name = 'escola' AND column_name = 'segmento_escola'
                    `);
                    return parseInt(hasEscolaSegmentoColumn.rows[0].count) > 0;

                case '012_add_foto_perfil_usuario.sql':
                    const hasFotoPerfilColumn = await this.pool.query(`
                        SELECT COUNT(*) FROM information_schema.columns 
                        WHERE table_name = 'usuario' AND column_name = 'foto_perfil_url'
                    `);
                    return parseInt(hasFotoPerfilColumn.rows[0].count) === 0;
                
                case '013_create_ramal_table.sql': {
                    // Verifica se a tabela ramal existe
                    const ramalTable = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ramal')"
                    );
                    if (!ramalTable.rows[0].exists) return true;

                    // Verifica se a coluna ramal_id existe em escola
                    const ramalIdColumn = await this.pool.query(
                        "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'escola' AND column_name = 'ramal_id'"
                    );
                    if (parseInt(ramalIdColumn.rows[0].count) === 0) return true;

                    // Verifica se todos os ramais necessários existem
                    const ramaisNecessarios = [
                        'RAMAL SÃO FRANCISCO',
                        'RAMAL DORNELAS',
                        'RAMAL SAFIRA',
                        'RAMAL BARRA',
                        'RAMAL PORTO',
                        'RAMAL DORNELAS/BOA FAMÍLIA',
                        'RAMAL DORNELAS/PIRAPANEMA',
                        'RAMAL BARRA/BELISÁRIO',
                        'RAMAL BARRA/BR116',
                        'RAMAL SÃO JOÃO DO GLÓRIA'
                    ];
                    const ramaisNoBanco = await this.pool.query(
                        `SELECT nome_ramal FROM ramal WHERE nome_ramal = ANY($1)`, [ramaisNecessarios]
                    );
                    if (ramaisNoBanco.rows.length < ramaisNecessarios.length) return true;

                    // Verifica se ainda existe escola sem ramal_id
                    const escolasSemRamal = await this.pool.query(
                        "SELECT COUNT(*) FROM escola WHERE ramal_id IS NULL"
                    );
                    if (parseInt(escolasSemRamal.rows[0].count) > 0) return true;

                    // Se tudo existe e está associado, não precisa rodar
                    return false;
                }

                case '014_create_auditoria_pedido_table.sql':
                    const auditoriaPedidoExists = await this.pool.query(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'auditoria_pedido')"
                    );
                    return !auditoriaPedidoExists.rows[0].exists;
                
                case '015_add_tipo_pedido_to_auditoria_pedido.sql': {
                    // Verifica se a coluna tipo_pedido já existe
                    const tipoPedidoColumn = await this.pool.query(
                        "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'auditoria_pedido' AND column_name = 'tipo_pedido'"
                    );
                    return parseInt(tipoPedidoColumn.rows[0].count) === 0;
                }
                
                default:
                    return true; // Se não souber, tenta executar
            }
        } catch (error) {
            return true; // Se der erro na verificação, tenta executar
        }
    }

    async checkEssentialTables() {
        const essentialTables = [
            'segmento',
            'periodo_lancamento',
            'escola_segmento',
            'estoque',
            'password_reset_otp',
            'auditoria_pedido',
            'ramal',
            'usuario',
            'escola',
            'pedido'
        ];
        const missing = [];
        for (const table of essentialTables) {
            try {
                const res = await this.pool.query(
                    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`, [table]
                );
                if (!res.rows[0].exists) missing.push(table);
            } catch (err) {
                missing.push(table);
            }
        }
        return missing;
    }

    async run() {
        console.log('🚀 NORMALIZAÇÃO DO BANCO DE DADOS - MERENDA SMART FLOW');
        console.log('='.repeat(60));
        console.log('🎯 Objetivo: Normalizar tabelas escola, estoque e segmentos');
        console.log('📦 Total de migrations: 12');
        console.log('');

        try {
            // 1. Verificar conexão
            const connected = await this.checkConnection();
            if (!connected) {
                process.exit(1);
            }
            
            // 2. Listar migrations
            const migrationFiles = this.getMigrationFiles();
            if (migrationFiles.length === 0) {
                console.error('❌ Nenhum arquivo de migration encontrado!');
                process.exit(1);
            }

            console.log(`📁 Encontrados ${migrationFiles.length} arquivos de migration:\n`);

            let executed = 0;
            let skipped = 0;
            let errors = 0;

            // 3. Executar cada migration
            for (const fileName of migrationFiles) {
                console.log(`🔄 Processando: ${fileName}`);
                
                // Verificar se precisa executar
                const needsExecution = await this.checkIfMigrationNeeded(fileName);
                
                if (!needsExecution) {
                    console.log(`⏭️  ${fileName} - Já executada, pulando...`);
                    skipped++;
                    console.log('');
                    continue;
                }
                
                // Executar migration
                const result = await this.executeMigration(fileName);
                
                if (result.success) {
                    if (result.warning) {
                        console.log(`⚠️  ${fileName} - Executada com aviso`);
                        console.log(`   💡 ${result.warning}`);
                    } else {
                        console.log(`✅ ${fileName} - Executada com sucesso!`);
                    }
                    executed++;
                } else {
                    console.log(`❌ ${fileName} - Erro:`);
                    console.log(`   🔍 ${result.error}`);
                    errors++;
                }
                
                console.log('');
            }

            // 4. Relatório final
            this.showFinalReport(executed, skipped, errors);

            // 5. Verificação das tabelas essenciais
            const missingTables = await this.checkEssentialTables();
            if (missingTables.length === 0) {
                console.log('🟢 Todas as tabelas essenciais foram criadas com sucesso!');
            } else {
                console.log('🔴 Atenção: As seguintes tabelas essenciais NÃO foram encontradas:');
                missingTables.forEach(tbl => console.log('   • ' + tbl));
                console.log('💡 Verifique as migrations e o banco de dados.');
            }
            
        } catch (error) {
            console.error('❌ Erro fatal:', error.message);
            process.exit(1);
        } finally {
            await this.pool.end();
        }
    }

    getMigrationFiles() {
        if (!fs.existsSync(this.migrationsDir)) {
            console.error('❌ Diretório migrations/ não encontrado!');
            return [];
        }

        return fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
    }

    async executeMigration(fileName) {
        const filePath = path.join(this.migrationsDir, fileName);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        try {
            await this.pool.query(sql);
            return { success: true };
        } catch (error) {
            // Erros esperados que podem ser ignorados
            const expectedErrors = [
                'already exists',
                'duplicate key',
                'duplicar valor da chave viola a restrição de unicidade',
                'não são permitidas múltiplas chaves primárias',
                'já existe'
            ];
            
            const isExpectedError = expectedErrors.some(expectedError => 
                error.message.toLowerCase().includes(expectedError.toLowerCase())
            );
            
            if (isExpectedError) {
                return { success: true, warning: 'Dados já existentes ou tabela já criada' };
            }
            
            return { success: false, error: error.message };
        }
    }

    showFinalReport(executed, skipped, errors) {
        console.log('📊 RELATÓRIO FINAL:');
        console.log('='.repeat(30));
        console.log(`✅ Executadas: ${executed}`);
        console.log(`⏭️  Puladas: ${skipped}`);
        console.log(`❌ Erros: ${errors}`);
        console.log('');
        
        if (errors === 0) {
            console.log('🎉 NORMALIZAÇÃO CONCLUÍDA COM SUCESSO!');
            console.log('✅ Banco de dados normalizado e pronto para uso!');
            console.log('');
            console.log('📋 Estruturas criadas:');
            console.log('   • Tabela segmento (4 segmentos padrão)');
            console.log('   • Tabela periodo_lancamento (períodos globais)');
            console.log('   • Tabela escola_segmento (relacionamento N:N)');
            console.log('   • Colunas normalizadas na tabela estoque');
            console.log('   • Foreign Keys e constraints de integridade');
            console.log('   • Índices para otimização de performance');
            console.log('   • Período de teste junho/2025 inserido');
            console.log('   • Limpeza de colunas obsoletas (segmento_estoque)');
        } else {
            console.log('⚠️  Algumas migrations falharam.');
            console.log('💡 Verifique os erros acima e execute novamente se necessário.');
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const runner = new MigrationRunner();
    runner.run();
}

module.exports = MigrationRunner;
