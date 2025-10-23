import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";

const Add = ({ path }) => {
  return (
    <Link to={path}>
      <IconButton color="secondry-color" title="Add">
        <i className="fa-solid fa-plus" />
      </IconButton>
    </Link>
  );
};

export default Add;
