import React from 'react'
import { Suspense } from 'react'
import Search from '@/components/SearchSuspense'
function page() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
      <Search/>
      </Suspense>
    </div>
  )
}

export default page
