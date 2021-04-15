import { Box, Flex, Link, Button } from '@chakra-ui/core'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { createUrqlClient } from '../utils/createUrqlClient'

import { useForgotPasswordMutation } from '../generated/graphql'
import { useState } from 'react'

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          //console.log(values)
          await forgotPassword(values)
          setComplete(true)
          //  console.log(response)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              {' '}
              if an account with that amil exixst, we sent you an email
            </Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField
                  name='email'
                  placeholder='email'
                  label='Email'
                  type='email'
                />
              </Box>

              <Button
                mt={4}
                isLoading={isSubmitting}
                type='submit'
                variantColor='teal'
              >
                forgot Passoword
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
