import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Link, Flex } from '@chakra-ui/core'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useLoginMutation, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'

const Login: React.FC<{}> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values)
          const response = await login(values)
          console.log(response)
          if (response.data?.login.errors) {
            ;[{ field: 'usname', message: 'something went wrong' }]
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            //wrokes

            if (typeof router.query.next === 'string') {
              router.push(router.query.next)
            }
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              placeholder='username or email'
              label='Username or Email'
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Flex mt={2}>
              <NextLink href='/forgot-password'>
                <Link ml='auto'>Forgot Password ?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type='submit'
              variantColor='teal'
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
