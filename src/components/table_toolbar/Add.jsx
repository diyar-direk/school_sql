import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";

const Add = ({ path, ...props }) => {
  return (
    <Link to={path} {...props}>
      <IconButton color="secondry-color" title="Add">
        <i className="fa-solid fa-plus" />
      </IconButton>
    </Link>
  );
};

export default Add;
