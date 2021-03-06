import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { Box, Button } from '@chakra-ui/core'
import { Formik, Form } from 'formik'
import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import router, { useRouter } from 'next/router'
import {
  usePostQuery,
  usePostsQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql'
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl'
import { useGetIntId } from '../../../utils/useGetIntId'

const EditPost: React.FC = ({}) => {
  const router = useRouter()
  const intId = useGetIntId()
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
  const [, updatePost] = useUpdatePostMutation()
  if (fetching) {
    return (
      <Layout>
        <div>...loading</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box> Could not find poszs </Box>
      </Layout>
    )
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          // const { error } = await createPost({ input: values })
          // console.log(error)
          // if (!error) {
          //   router.push('/')
          await updatePost({ id: intId, ...values })
          router.back()
          // }
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
              update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditPost)
