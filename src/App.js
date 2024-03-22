import styles from './App.module.css'
import GameTable from './components/GameTable';

function App() {

  return (
    <div>
      <div className={styles.main}>
        <GameTable />
      </div>
      <div className={styles.background}>
        <p>BLACKJACK PAYS 3 TO 2</p>
        <p>Dealer must stand on 17 and must draw to 16</p>
        <p>INSURANCE PAYS 2 TO 1</p>
      </div>

    </div>
  );
}

export default App;
