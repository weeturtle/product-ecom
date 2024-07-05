import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    name: String!
    description: String
    varients: [Varient!]!
  }

  type Varient {
    name: String!
    product: Product!
    options: [Option!]!
  }

  type Option {
    name: String!
    varient: Varient!
  }

  input VarientInput {
    name: String!
    options: [OptionInput!]!
  }

  input OptionInput {
    name: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(
      name: String!
      description: String
      varients: [VarientInput]!
    ): Product!
  }
`;
