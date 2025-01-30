import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="text-lg font-bold">Home</Link>
            <Link to="/records" className="ml-4">Cow Records</Link>
            <Link to="/breeding" className="ml-4">Breeding</Link>
            <Link to="/logout" className="ml-4">Logout</Link>
          </div>
          <div className="flex items-center">
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
