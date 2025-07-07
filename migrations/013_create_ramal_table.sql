-- Criação da tabela ramal
CREATE TABLE ramal (
    id_ramal UUID PRIMARY KEY,
    nome_ramal VARCHAR(100) NOT NULL
);

-- Adiciona a coluna ramal_id na tabela escola
ALTER TABLE escola ADD COLUMN ramal_id UUID REFERENCES ramal(id_ramal);

-- Insere os ramais
INSERT INTO ramal (id_ramal, nome_ramal)
SELECT gen_random_uuid(), nome
FROM (
    VALUES
        ('RAMAL SÃO FRANCISCO'),
        ('RAMAL DORNELAS'),
        ('RAMAL SAFIRA'),
        ('RAMAL BARRA'),
        ('RAMAL PORTO'),
        ('RAMAL DORNELAS/BOA FAMÍLIA'),
        ('RAMAL DORNELAS/PIRAPANEMA'),
        ('RAMAL BARRA/BELISÁRIO'),
        ('RAMAL BARRA/BR116'),
        ('RAMAL SÃO JOÃO DO GLÓRIA')
) AS t(nome)
WHERE NOT EXISTS (
    SELECT 1 FROM ramal r WHERE r.nome_ramal = t.nome
);

DO $$
BEGIN
    -- Atualiza as escolas para cada ramal usando o nome do ramal, apenas se ainda não estiverem associadas
    IF EXISTS (SELECT 1 FROM escola WHERE ramal_id IS NULL) THEN

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL SÃO FRANCISCO') WHERE nome_escola IN (
            'E M DR ANTÔNIO CANÊDO',
            'E M PROF MARIA QUITÉRIA PÉREZ SCHELB',
            'E M PROF TEREZINHA MARIA OLIVEIRA RIBEIRO',
            'E M IRENE PEREIRA DIAS NUNES',
            'E M PROF EDMEN MACEDO GERMANO DE ALVARENGA'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL DORNELAS') WHERE nome_escola IN (
            'E M MARIA DO CARMO CERQUEIRA CASTRO',
            'E M MARIA HASTENREITER DORNELAS',
            'E M CÂNDIDO PORTINARI',
            'E M ALZIRA CHAVES LACERDA',
            'E M CLÉRIA TICON CARNEIRO',
            'E M NELSON CARDOSO DE MELO',
            'E M PROF ZÉLIA BARROS CARNEIRO'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL SAFIRA') WHERE nome_escola IN (
            'E M RICARDO OLIVEIRA MORAIS DE AZEVEDO',
            'E E WALTER VASCONCELOS',
            'CRECHE ALFREDO COUTO',
            'E M GILBERTO JOSÉ TANUS BRAZ',
            'E M SEBASTIÃO LAVIOLA'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL BARRA') WHERE nome_escola IN (
            'E M JOSÉ MIGUEL MUAHAD',
            'E M PROF ODALÉIA OLIVEIRA MORAIS DE AZEVEDO',
            'E M PROF STELLA FIDELES',
            'E M PROF ELZA ROGÉRIO',
            'E M VALDIVINO DOS SANTOS MENDES'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL PORTO') WHERE nome_escola IN (
            'E M MARIA ALELUIA SOARES BITTENCOURT',
            'E M CLARA DE CASTRO ROGÉRIO',
            'E M PROF ZULEIMA CÉSAR DE ARAÚJO',
            'E M JOAQUIM RIBEIRO DE CARVALHO (CAIC)',
            'E M PROF ESMERALDA VIANNA',
            'E M PROF IONYR BASTOS DIAS'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL DORNELAS/BOA FAMÍLIA') WHERE nome_escola IN (
            'E M DEJANIRA PASSONI DE OLIVEIRA',
            'E M PASCHOAL DEMARQUE',
            'E M PRESIDENTE TANCREDO NEVES'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL DORNELAS/PIRAPANEMA') WHERE nome_escola IN (
            'E M ONÉA LOPES GOUVÊA',
            'E M JÉSUS FRANCISCO DE ARAÚJO',
            'E M ERMYRO TEIXEIRA SIQUEIRA',
            'E M SYLLA DE URURAHY MACÊDO',
            'E M SÉRGIO LÚCIO FERNANDES AMARAL'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL BARRA/BELISÁRIO') WHERE nome_escola IN (
            'E M TV ANTÔNIO PEREIRA DA SILVA',
            'E M ODUVALDO ALEIXO',
            'E M PROF MARIA AMELIA MEIRELES CALAIS',
            'E M YOLANDA CERQUEIRA GONÇALVES'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL BARRA/BR116') WHERE nome_escola IN (
            'E M ANTÔNIO PEREIRA DA SILVA',
            'E M ARISTÓTELES DA SILVA BRAGA'
        ) AND ramal_id IS NULL;

        UPDATE escola SET ramal_id = (SELECT id_ramal FROM ramal WHERE nome_ramal = 'RAMAL SÃO JOÃO DO GLÓRIA') WHERE nome_escola IN (
            'E M ANTÔNIO FORTINI'
        ) AND ramal_id IS NULL;

    END IF;
END
$$;
