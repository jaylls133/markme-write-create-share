
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Button asChild size="lg">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
