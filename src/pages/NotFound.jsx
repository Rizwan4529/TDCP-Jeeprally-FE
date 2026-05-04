import { Link, useNavigate } from "react-router"
import Footer from "../layouts/Footer"
import Header from "../layouts/Header"
import Button from "../components/common/Button"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <Header />
      <div className="min-h-[90vh] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
        
        <Button
          onClick={() => navigate(-1)}
          // className="cursor-pointer px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Go Back
        </Button>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound
