const express = require('express');

const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors())
app.use(express.static('.'))
app.listen(3000);


const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type User{
        user_id: ID
        full_name: String
        email: String
    }
    type Product {
        productId: ID
        productName: String
    }

    type RootQuery {
        getUser: [User]
        getUserList: [User]
    }
    
    type RootMutation{
        createUser(id: Int, name: String): Product
    }

    schema {
        query: RootQuery
        mutation: RootMutation 
    }
`)

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const rootValue = {
    getUser: async () => {
        let data = await prisma.user.findMany();
        return data
    },
    getUserList: () => {
        return [{
            userId: 1,
            userName: 'abc2',
            email: "abc@gmail.com"
        },
        {
            userId: 2,
            userName: 'abc2đsf',
            email: "nnnn@gmail.com"
        }]
    },
    createUser: ({ id, name }) => {

        return {
            productId: id,
            productName: name
        }
    }
}

app.use('/api', graphqlHTTP({
    schema,  // nơi chứa model của graphql
    rootValue, // nơi đổ data cho các model ở schema
    graphiql: true   // i : interface - giao diện 
}))