import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from 'urql'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'

import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'

import { pipe, tap } from 'wonka'
import Router from 'next/router'
import { replace } from 'formik'

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info
    //console.log(entityKey, fieldName)
    const allFields = cache.inspectFields(entityKey)
    //  console.log('allfields', allFields)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }
    // console.log(fieldArgs)
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    // console.log('key we created', fieldKey)
    const isItInTheCache = cache.resolveFieldByKey(entityKey, fieldKey)
    // console.log(isItInTheCache)
    info.partial = !isItInTheCache
    const results: string[] = []
    fieldInfos.forEach((fi) => {
      const data = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string[]

      results.push(...data)
    })
    return results

    //   const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    //   const isItInTheCache = cache.resolve(
    //     cache.resolveFieldByKey(entityKey, fieldKey) as string,
    //     'posts'
    //   )
    //   info.partial = !isItInTheCache
    //   let hasMore = true
    //   const results: string[] = []
    //   fieldInfos.forEach((fi) => {
    //     const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
    //     const data = cache.resolve(key, 'posts') as string[]
    //     const _hasMore = cache.resolve(key, 'hasMore')
    //     if (!_hasMore) {
    //       hasMore = _hasMore as boolean
    //     }
    //     results.push(...data)
    //   })

    //   return {
    //     __typename: 'PaginatedPosts',
    //     hasMore,
    //     posts: results,
    //   }
  }
}

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login')
      }
    })
  )
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            )
          },

          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            )
          },

          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                } else {
                  return {
                    me: result.register.user,
                  }
                }
              }
            )
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
})
