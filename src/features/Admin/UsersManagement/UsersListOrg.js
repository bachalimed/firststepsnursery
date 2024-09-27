import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import SectionTabsDown from "../../../Components/Shared/Tabs/SectionTabsDown";

const UsersList = () => {
  //get several things from the query
  const {
    data: users, //the data is renamed users
    isLoading, //monitor several situations is loading...
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    pollingInterval: 60000, //will refetch data every 60seconds
    refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true, //refetch when we remount the component
  });
  //define the content to be conditionally rendered
  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>; //errormessage class defined in the css, the error has data and inside we have message of error
  }

  if (isSuccess) {
    const { ids } = users; //destructure the ids from users from data, id are in array now

    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />) //mapping over the id, create user components starting with their id, check if id will match the User model
      : null; //if no length to the ids it will be null

    content = //create a table, the classes are in the css tailored
      (
        <>
          <SectionTabsDown />

          <table className="table table--users">
            {/*//flattened the table to display grid, check css file*/}
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th user__username">
                  Username
                </th>
                <th scope="col" className="table__th user__roles">
                  Full Name
                </th>
                <th scope="col" className="table__th user__roles">
                  DOB
                </th>
                <th scope="col" className="table__th user__roles">
                  Employee Id
                </th>
                <th scope="col" className="table__th user__roles">
                  Roles
                </th>
                <th scope="col" className="table__th user__roles">
                  Parent Id
                </th>
                <th scope="col" className="table__th user__edit">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </>
      );
  }

  return content;
};
export default UsersList;
