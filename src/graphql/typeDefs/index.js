import types from './types';
import interfaces from './interfaces';
import queryType from './query';

const typeDefs = [...types, ...interfaces, queryType];

export default typeDefs;
