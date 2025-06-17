/**
 * Migração para alterar o campo segmento_escola da tabela escola
 * para armazenar um array de strings (JSON) em vez de uma única string
 */
exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE escola 
    ALTER COLUMN segmento_escola TYPE JSONB 
    USING to_jsonb(ARRAY[segmento_escola])
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE escola 
    ALTER COLUMN segmento_escola TYPE VARCHAR 
    USING segmento_escola->0
  `);
};
