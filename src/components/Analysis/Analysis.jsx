import React from 'react';
import { Bar } from 'react-chartjs-2';
import AnalysisCss from './Analysis.module.css';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)


export function Analysis(props) {
  //functions to get date from localStorage
  function getMyRightDate(date) {
    let newD = date.split(" ")[0];
    return newD;
  }
  function getMyDay(date) {
    let newD = date.split('-')[2];
    return newD;
  }
  //function to get value by categorie
  function sumDatesByDay(datesArray, tableExpensesorIncomes, categorieId) {
    let obtainedDays = [];
    for (let i of datesArray) {
      obtainedDays.push(getMyDay(i));
    }
    let objectData = {};
    for (let i of obtainedDays) {
      objectData[i] = 0;
    }
    if (categorieId == 0) {
      for (let j in objectData) {
        for (let i of tableExpensesorIncomes) {
          if (getMyDay(getMyRightDate(i.date)) == j) {
            objectData[j] += i.price;
          }
        }
      }
    }
    else {
      for (let j in objectData) {
        for (let i of tableExpensesorIncomes) {
          if (getMyDay(getMyRightDate(i.date)) == j && i.categorie == categorieId) {
            objectData[j] += i.price;
          }
        }
      }
    }
    return objectData;
  }
  //Expenses Chart:
  const getLocalStorageE = JSON.parse(localStorage.getItem('expenses'));
  let getLocalStorageELabel;

  if (props.categorieAnalysisE == 0) {
    getLocalStorageELabel = getLocalStorageE;
  }
  else {
    getLocalStorageELabel = getLocalStorageE.filter(expense => expense.categorie == props.categorieAnalysisE);
  }

  let labelsD = [...new Set(getLocalStorageELabel.map(expense => getMyRightDate(expense.date)))];
  const sumDatesValues = sumDatesByDay(labelsD, getLocalStorageE, props.categorieAnalysisE);
  const dataToUse = [];
  for (let i in sumDatesValues) {
    dataToUse.push(sumDatesValues[i]);
  }

  labelsD.sort();

  const dataE = {
    labels: labelsD,
    datasets: [
      {
        label: props.categorieObjetE.filter(categorie => categorie.id == props.categorieAnalysisE) == 0 ? "All Expense Categories" : props.categorieObjetE.filter(categorie => categorie.id == props.categorieAnalysisE)[0].libelle,
        data: dataToUse,
        borderColor: ['rgb(53,162,235)', 'rgb(255,26,104)', "rgb(255,159,64)", "rgb(0,206,86)"],
        backgroundColor: ["rgba(53,162,235,0.4)", "rgba(255,26,104,0.4)", "rgba(255,159,64,0.4)", "rgba(0,206,86,0.4)"]
      }
    ]
  };

  const optionsE = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Expenses Chart"
      },
      tooltip: {
        yAlign: 'top',
        displayColors: false,
        padding: 10
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  //Incomes Chart:
  const getLocalStorageI = JSON.parse(localStorage.getItem('incomes'));
  let getLocalStorageILabel;

  if (props.categorieAnalysisI == 0) {
    getLocalStorageILabel = getLocalStorageI;
  }
  else {
    getLocalStorageILabel = getLocalStorageI.filter(income => income.categorie == props.categorieAnalysisI);
  }

  let labelsDI = [...new Set(getLocalStorageILabel.map(income => getMyRightDate(income.date)))];
  const sumDatesValuesI = sumDatesByDay(labelsDI, getLocalStorageI, props.categorieAnalysisI);
  const dataToUseI = [];
  for (let i in sumDatesValuesI) {
    dataToUseI.push(sumDatesValuesI[i]);
  }

  labelsDI.sort();

  const dataI = {
    labels: labelsDI,
    datasets: [
      {
        label: props.categorieObjetI.filter(categorie => categorie.id == props.categorieAnalysisI) == 0 ? "All Income Categories" : props.categorieObjetI.filter(categorie => categorie.id == props.categorieAnalysisI)[0].libelle,
        data: dataToUseI,
        borderColor: ['rgb(53,162,235)', 'rgb(255,26,104)'],
        backgroundColor: ["rgba(53,162,235,0.4)", "rgba(255,26,104,0.4)"]
      }
    ]
  };

  const optionsI = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Incomes Chart"
      },
      tooltip: {
        yAlign: 'top',
        displayColors: false,
        padding: 10
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  
  
  return <div className={AnalysisCss.Analysis}>
    <div className={AnalysisCss.header}>Analysis</div>
    <div className={AnalysisCss.Charts}>
      <div className={AnalysisCss.AnalysisExpenses}>
        <div className={AnalysisCss.headerChart}>
          <label htmlFor="categorie">Expenses Categorie:</label>
          <select onChange={e => props.filterCategorieAnalysisE(e)} type="text" name='categorie'>
            <option value="">All Categories</option>
            {props.categorieObjetE.map(categorie => <option key={categorie.id} value={categorie.id}>{categorie.libelle}</option>)}
          </select>
        </div>
        <Bar data={dataE} options={optionsE} width={600} height={400} />
      </div>
      <div className={AnalysisCss.AnalysisIncomes}>
        <div className={AnalysisCss.headerChart}>
          <label htmlFor="categorie">Incomes Categorie:</label>
          <select onChange={e => props.filterCategorieAnalysisI(e)} type="text" name='categorie'>
            <option value="">All Categories</option>
            {props.categorieObjetI.map(categorie => <option key={categorie.id} value={categorie.id}>{categorie.libelle}</option>)}
          </select>
        </div>
        <Bar data={dataI} options={optionsI} width={600} height={400} />
      </div>
    </div>

  </div>;
}
