import knex from 'knex'
import knefConfig from '../knexfile'

export const db = knex(knefConfig.development)