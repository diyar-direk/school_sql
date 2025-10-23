import { roles } from "../constants/enums";
import { useAuth } from "../context/AuthContext";
import AdminProfile from "./admin/AdminProfile";
import StudentProfile from "./students/StudentProfile";
import TeacherProfile from "./teachers/TeacherProfile";

const Profile = () => {
  const { userDetails } = useAuth();

  if (userDetails.role === roles.admin) return <AdminProfile />;
  else if (userDetails.role === roles.teacher) return <TeacherProfile />;
  return <StudentProfile />;
};

export default Profile;
