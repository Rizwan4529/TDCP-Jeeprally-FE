import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 60 * 1000, // 1 minute in ms
      staleTime: 60 * 1000, // data considered fresh for 1 minute
      refetchOnWindowFocus: true, // auto-refresh when user refocuses tab
    },
  },
})
const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider
