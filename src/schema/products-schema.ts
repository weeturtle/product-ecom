import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    defaultSkuId: ID

    varients: [Varient]!
  }

  type ProductWithOptions {
    id: ID!
    name: String!
    description: String
    defaultSkuId: ID

    varients: [VarientOptions]!
  }

  type Varient {
    id: ID!
    name: String!
  }

  type VarientOptions {
    varient: Varient!
    options: [String!]!
  }

  type OptionVarientPair {
    varient: Varient!
    value: String!
  }

  type SKU {
    id: ID!
    product: Product!
    price: Float!
    stock: Int!
    images: [String!]!

    options: [OptionVarientPair]!
  }

  type DisplayProduct {
    id: ID!
    name: String!
    description: String
    defaultSkuId: ID
    options: [OptionVarientPair]!
    images: [String]!
    price: Float!
    stock: Int!
  }

  input OptionVarientIDInput {
    varient_id: ID!
    value: String!
  }

  input OptionVarientNameInput {
    varient_name: String!
    value: String!
  }

  input DetailedOptionInput {
    options: [OptionVarientNameInput]!
    price: Float!
    stock: Int!
    images: [String]!
    isDefault: Boolean
  }

  type Query {
    products: [Product]!
    product(id: ID!): ProductWithOptions
    productByOptions(productID: ID!, options: [OptionVarientIDInput]!): SKU
    displayProducts: [DisplayProduct]!
  }

  type Mutation {
    createProduct(
      name: String!
      description: String
      varients: [String]!
      options: [DetailedOptionInput]!
    ): Product!
  }
`;
