import React from 'react'
import { Flex, IconButton } from '@chakra-ui/core'
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
} from '../generated/graphql'
import { useState } from 'react'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading')
  const [, vote] = useVoteMutation()

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading')
          await vote({
            postId: post.id,
            value: 1,
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'updoot-loading'}
        aria-label='updoot post'
        icon='chevron-up'
      />

      {post.points}
      <IconButton
        onClick={() => {
          setLoadingState('downdoot-loading')
          vote({
            postId: post.id,
            value: -1,
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'downdoot-loading'}
        aria-label='downdoot post'
        icon='chevron-down'
      />
    </Flex>
  )
}
