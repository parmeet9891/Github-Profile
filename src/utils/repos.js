import axios from "axios";

let top = new Map();
let topStarred = [];
let backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(242, 174, 231, 0.2)",
  "rgba(135, 131, 131, 0.2)",
];

export const options = {
  pieOptions: {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
      datalabels: {
        display: true,
      },
      title: {
        display: true,
        text: "Top Languages",
      },
    },
  },
  barOptions: {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: 20,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      datalabels: {
        display: true,
      },
      title: {
        display: true,
        text: "Most Starred",
      },
    },
  },
};

const topLanguages = (repos) => {
  for (let i = 0; i < repos.length; i++) {
    let lang = repos[i].language;
    if (repos[i].fork === true) continue;
    if (lang === null) continue;
    if (top.has(lang.toUpperCase())) {
      let value = top.get(lang.toUpperCase()) + 1;
      top.set(lang.toUpperCase(), value);
    } else {
      top.set(lang.toUpperCase(), 1);
    }
  }
};

function getCustomValues(arr, size) {
  if (arr.length > size) return arr.slice(0, size);
  else return arr;
}

const enqueue_repo = (currentRepo) => {
  let contain = false;
  for (let i = 0; i < topStarred.length; i++) {
    if (currentRepo["stargazers_count"] > topStarred[i]["stargazers_count"]) {
      topStarred.splice(i, 0, currentRepo);
      contain = true;
      break;
    }
  }
  if (!contain) {
    topStarred.push(currentRepo);
  }
};

export const getPieData = (repos) => {
  topLanguages(repos);
  let labels = [],
    data = [];
  for (let [key, value] of top.entries()) {
    labels.push(key);
    data.push(value);
  }

  return {
    labels: getCustomValues(labels, 8),
    datasets: [
      {
        label: "Languages Used",
        data: getCustomValues(data, 8),
        backgroundColor: backgroundColors.slice(
          0,
          labels.length > 8 ? 8 : labels.length
        ),
        //borderColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };
};

export const mostStarred = (repos) => {
  topStarred = [];
  for (let i = 0; i < repos.length; i++) {
    let currentRepo = repos[i];
    if (currentRepo.fork === true) continue;
    else {
      enqueue_repo(currentRepo);
    }
  }
  let l = [],
    d = [];
  l = topStarred.map((value) => value.name);
  d = topStarred.map((value) => value.stargazers_count);
  return {
    labels: getCustomValues(l, 5),
    datasets: [
      {
        label: "Repositories with Stars",
        data: getCustomValues(d, 5),
        backgroundColor: backgroundColors.slice(0, l.length > 5 ? 5 : l.length),
        borderWidth: 1,
      },
    ],
  };
};

export const getRepos = () => {
  return getCustomValues(topStarred, 8);
};

const merge = (left, right, priority) => {
  let newArr = [];
  while (left.length && right.length) {
    if (left[0][`${priority}`] < right[0][`${priority}`]) {
      newArr.push(left.shift());
    } else {
      newArr.push(right.shift());
    }
  }
  while (left.length) {
    newArr.push(left.shift());
  }
  while (right.length) {
    newArr.push(right.shift());
  }
  return newArr;
};

export const mergeSort = (arr, priority) => {
  const half = Math.floor(arr.length / 2);
  if (arr.length < 2) return arr;
  const left = arr.slice(0, half);
  const right = arr.slice(half, arr.length);
  const sort_left = mergeSort(left, priority);
  const sort_right = mergeSort(right, priority);
  return merge(sort_left, sort_right, priority);
};

export const FetchData = async (values) => {
  try {
    const [first, second] = await Promise.all([
      axios.get(`https://api.github.com/users/${values.id}`),
      axios.get(`https://api.github.com/users/${values.id}/repos`),
    ]);
    return [first, second];
  } catch (e) {
    console.log("Exception occured " + e);
  }
};
