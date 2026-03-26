import { useState } from 'react'

import { FeedType } from '../config/feed-source'
import { Source } from '../database/schema/source'
import { getAllSources } from '../services/db/source'

export const useSources = () => {
  const [rssSources, setRssSources] = useState<Source[]>([])
  const [redditSources, setRedditSources] = useState<Source[]>([])
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  const fetchAllSources = () => {
    const { rss, subreddits } = getAllSources()
    setRssSources(rss)
    setRedditSources(subreddits)
  }

  const appendNewSource = (newSource: Source) => {
    if (newSource.type === FeedType.RSS) setRssSources([...rssSources, newSource])
    else setRedditSources([...redditSources, newSource])
  }

  const displaySuccessMessage = () => {
    setShowSnackbar(true)
    setTimeout(() => setShowSnackbar(false), 1500)
  }

  const deleteSource = (source: Source) => {
    if (source.type === FeedType.RSS) setRssSources(rssSources.filter(({ id }) => id !== source.id))
    else setRedditSources(redditSources.filter(({ id }) => id !== source.id))
  }

  return {
    rssSources,
    redditSources,
    fetchAllSources,
    showSnackbar,
    displaySuccessMessage,
    appendNewSource,
    deleteSource,
  }
}
