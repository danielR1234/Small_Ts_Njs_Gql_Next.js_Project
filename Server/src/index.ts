import 'reflect-metadata'
//import { MikroORM } from '@mikro-orm/core'
import { COOKIE_NAME, __prod__ } from './entities/constants'
// import { Post } from './entities/Post';
//import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
//import { MyContext } from './types'
import cors from 'cors'

import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'
import path from 'path'
import { Updoot } from './entities/Updoot'
import { createUserLoader } from './utils/createUserLoader'
import { createUpdootLoader } from './utils/createUpdootLoader'

//rerunnn

//import { sendEmail } from './utils/sendEmail'
// https://ethereal.email/message/YHdn9OPgXlMKjniaYHdn9th64QXwHUBlAAAAAc.0DmiqdQs6AGCEBpozz98

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'reditclonetwo',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post, User, Updoot],
  })
  conn.runMigrations()

  //const orm = await MikroORM.init(microConfig)
  //await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),

      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrfb
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'keyboavervrevrevevrevrdcat',
      resave: false,
    })
  )

  const apolloserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      // em: orm.em,

      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  })

  apolloserver.applyMiddleware({
    app,
    cors: false,
  })

  app.listen(4000, () => {
    console.log('Server startet on port 4000')
  })

  //     const post = orm.em.create(Post, { title: "my third post" })
  //   await orm.em.persistAndFlush(post)

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)
}

main().catch((err) => {
  console.log(err)
})
