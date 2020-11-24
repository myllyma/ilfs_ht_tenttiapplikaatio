// import {useContext} from 'react';
// import {Context} from '../utility/provider.js';
import {Polar} from 'react-chartjs-2';

const data = {
  datasets: [{
    data: [
      (15/15 * 100).toFixed(2),
      (13/15 * 100).toFixed(2),
      (7/15 * 100).toFixed(2),
      (3/15 * 100).toFixed(2),
      (14/15 * 100).toFixed(2)
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED',
      '#36A2EB'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'Ohjelmoinnin alkeet',
    'React',
    'Palvelinkommunikaatio',
    'Tietokannat',
    'Pilvipalvelut'
  ]
}

const Visualization = () => {
  // const {state} = useContext(Context);
  
  return(
    <div>
      <Polar data={data} />
    </div>
  );
}

export default Visualization;