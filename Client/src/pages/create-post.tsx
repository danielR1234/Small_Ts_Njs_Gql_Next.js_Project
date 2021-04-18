import { Box, Button } from '@chakra-ui/core'
import { Formik, Form } from 'formik'

import React from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useCreatePostMutation, useMeQuery } from '../generated/graphql'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'
import { useEffect } from 'react'
import { route } from 'next/dist/next-server/server/router'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter()
  useIsAuth()

  const [, createPost] = useCreatePostMutation()
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values })
          console.log(error)
          if (!error) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='title' label='title' />
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='text...'
                label='Body'
              />
            </Box>

            <Button
              mt={4}
              isLoading={isSubmitting}
              type='submit'
              variantColor='teal'
            >
              create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
