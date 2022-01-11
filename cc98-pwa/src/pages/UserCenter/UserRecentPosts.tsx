import InfiniteList from '@/components/InfiniteList'
import { TopicItem } from '@/components/TopicList/TopicListItem'
import useInfList from '@/hooks/useInfList'
import { getMyRecentPosts } from '@/services/post'
import { navigateHandler } from '@/services/utils/errorHandler'
import { navigate } from '@/utils/history'
import { IPost } from '@cc98/api'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import ExpandPanel from './ExpandPanel'


const UserRecentPostsItem: React.FC<{
  post: IPost
}> = ({ post }) => {
  // FIXME: 后端应不返回签到
  if (post.content.startsWith('签到回复')) {
    return null
  }

  return (
    <TopicItem
      isAnonymous={post.isAnonymous}
      showAvatar={false}
      title={post.content}
      subtitle={`赞 ${post.likeCount} 踩 ${post.dislikeCount}`}
      info1={`${post.floor} L`}
      info2={dayjs(post.time).fromNow()}
      onClick={() => navigate(`/topic/${post.topicId}/${post.floor}`)}
    />
  )
}

const RecentPosts: React.FC = () => {
  const [expand, setExpand] = useState(false)

  const [posts, state, callback] = useInfList(getMyRecentPosts, {
    fail: navigateHandler,
  })
  const { isLoading, isEnd } = state
  const onChange = () => {
    setExpand(!expand)
  }

  return (
    <ExpandPanel expanded={expand} title="发表回复" onChange={onChange}>
      {expand && (
        <InfiniteList isLoading={isLoading} isEnd={isEnd} callback={callback}>
          {posts.map(post => (
            <UserRecentPostsItem key={post.id} post={post} />
          ))}
        </InfiniteList>
      )}
    </ExpandPanel>
  )
}

export default RecentPosts
