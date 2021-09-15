import { useState, useEffect } from "react";
import "./Profile.css";
import { withRouter, useParams } from "react-router-dom";
import { month } from "./../../utils/data";
import {
  getPieData,
  options,
  mostStarred,
  getRepos,
  mergeSort,
  FetchData,
} from "./../../utils/repos";
import PieData from "./../Pie-Chart/PieData";
import BarData from "./../Bar-Chart/BarData";

const Profile = (props) => {
  const values = useParams();
  const [pieChartData, setPieData] = useState({});
  const [barChartData, setBarData] = useState({});
  const [user, setUser] = useState({});
  const [allRepos, setRepos] = useState([]);

  useEffect(() => {
    let storeData = [];
    let response = [];
    async function extract() {
      response = await FetchData(values);
      if (response.length === 2) {
        setUser(response[0].data);
        const pieData = getPieData(response[1].data);
        const barData = mostStarred(response[1].data);
        let myRepos = getRepos();
        setPieData(pieData);
        setBarData(barData);
        setRepos(myRepos);
      }
    }
    extract();
  }, [values.id]);

  const convertDate = (d) => {
    let dt = new Date(d);
    return `${month[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  };

  const handleDropdownChange = (e) => {
    let filteredRepos = mergeSort(allRepos, e.target.value);
    filteredRepos = filteredRepos.reverse();
    setRepos(filteredRepos);
  };

  const formatSize = (size) => {
    if (size.length <= 3) return size;
    let s = size.toString().split("");
    let count = 3;
    for (let i = s.length - 1; i >= 0; i--) {
      if (count === 0) {
        count = 2;
        s.splice(i + 1, 0, ",");
      }
      count = count - 1;
    }
    return s.join("");
  };

  return (
    <div className="profile-content">
      <div className="user-data">
        <img
          src={`${user.avatar_url}`}
          alt="User Uploaded Image"
          className="img user-image"
        />
        <h1 className="user-name">{user.name}</h1>
        <a target="_blank" className="profile-url" href={`${user.html_url}`}>
          @{user.login}
        </a>
        <div className="details">
          {user.company ? (
            <div className="hr company">
              <ion-icon name="briefcase-sharp"></ion-icon>
              <p className="txt">{user.company}</p>
            </div>
          ) : null}
          {user.location ? (
            <div className="hr location">
              <ion-icon name="location-outline"></ion-icon>
              <p className="txt">{user.location}</p>
            </div>
          ) : null}
          {user.created_at ? (
            <div className="hr joined">
              <ion-icon name="calendar-outline"></ion-icon>
              <p className="txt">Joined {convertDate(user.created_at)}</p>
            </div>
          ) : null}
        </div>
        <div className="github-details">
          <div className="box total-repo">
            <p className="count">{user.public_repos}</p>
            <p className="title">repositories</p>
          </div>
          <div className="box total-followers">
            <p className="count">{user.followers}</p>
            <p className="title">followers</p>
          </div>
          <div className="box total-following">
            <p className="count">{user.following}</p>
            <p className="title">following</p>
          </div>
        </div>
      </div>
      <div className="repos-data">
        <div className="repos-graph">
          <div className="graph">
            <PieData
              data={pieChartData}
              options={options.pieOptions}
              width={50}
              height={50}
            />
          </div>
          <div className="graph">
            <BarData
              data={barChartData}
              options={options.barOptions}
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className="filter-repos">
          <div className="header">
            <h2>Top Repositories</h2>
            <select
              defaultValue={"stargazers_count"}
              className="dropdown"
              onChange={handleDropdownChange}
            >
              <option className="op" value="stargazers_count">
                Stars
              </option>
              <option value="size" className="op">
                Size
              </option>
              <option value="forks_count" className="op">
                fork
              </option>
            </select>
          </div>
          <div className="repos-list">
            {allRepos.map((value, index) => {
              return (
                <div className="list-box" key={`Box-${value.id}`}>
                  <div className="name">
                    <ion-icon size="small" name="folder-outline"></ion-icon>
                    <p>{value.name}</p>
                  </div>
                  <div className="desc">
                    <p>{value.description}</p>
                  </div>
                  <div className="repo-link">
                    <a href={`${value.html_url}`}>View Repo</a>
                  </div>
                  <div className="tools">
                    <div className="lang-data">
                      <div className="params">
                        <div className="circle"></div>
                        <p>{value.language ? value.language : null}</p>
                      </div>
                      <div className="params">
                        <ion-icon size="small" name="star"></ion-icon>
                        <p>{value.stargazers_count}</p>
                      </div>
                      <div className="params">
                        <ion-icon size="small" name="git-network"></ion-icon>
                        <p>{value.forks_count}</p>
                      </div>
                    </div>
                    <p className="size">{formatSize(value.size)} KB</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Profile);

/*
 
*/
