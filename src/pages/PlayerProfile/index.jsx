import React from 'react'
import PlayerProfile from './components/PlayerProfile'
import GearUpSection from './components/GearUpSection'
import RankingChart from './components/RankingsChart'
import Partners from '../JeepRally/components/Partners'

const Player = () => {
  return (
    <>
      <PlayerProfile />
      <GearUpSection />

      <RankingChart />

      <Partners />
    </>
  )
}

export default Player