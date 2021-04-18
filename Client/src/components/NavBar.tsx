import { Box, Flex, Link, Button } from '@chakra-ui/core'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logutFetchin }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  let body = null

  //data uss loading
  if (fetching) {
    //user is not logged
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color='whbrownite' mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>register</Link>
        </NextLink>
      </>
    )

    //user is logged in
  } else
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout()
          }}
          isLoading={logutFetchin}
          variant='link'
        >
          logout
        </Button>
      </Flex>
    )
  return (
    <Flex zIndex={1} position='sticky' top={0} bg='tan' p={4} ml={'auto'}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  )
}
