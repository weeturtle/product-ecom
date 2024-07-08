import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    varients: [Varient!]!
  }

  type Varient {
    id: ID!
    name: String!
  }

  type VarientDetails {
    varient_name: String!
    value: String!
  }

  type VarientOptions {
    varient_id: ID!
    varient_name: String!
    options: [String!]!
  }

  type OptionDetails {
    options: [VarientDetails!]!
    price: Float!
    stock: Int!
    images: [String!]!
  }

  input VarientInput {
    name: String!
  }

  input OptionInput {
    name: String!
  }

  type FullProduct {
    id: ID!
    name: String!
    description: String
    varients: [Varient!]!
    options: [String]
    price: Float!
    stock: Int!
    images: [String!]!
  }

  input OptionVarientInput {
    varient_id: String!
    value: String!
  }

  input OptionDetailsInput {
    options: [OptionVarientInput!]!
    price: Float!
    stock: Int!
    images: [String!]!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    productOptions(productID: ID!): [VarientOptions!]!
    productByOptions(
      productID: ID!
      options: [OptionVarientInput!]!
    ): FullProduct
  }

  type Mutation {
    createProduct(
      name: String!
      description: String
      varients: [String]!
      options: [OptionDetailsInput]!
    ): Product!
  }
`;
