import utilStyles from '../../styles/utils.module.css'

export default function NavigateButtons ({previousPage, nextPage, previousButton, nextButton}) {
  return (
    <div className={utilStyles.navigateButtons}>
      <button title="Previous Page" onClick={previousPage} disabled={!previousButton}
        className={previousButton ? utilStyles.round: utilStyles.disabledRound}>&#8249;
      </button>
      <button title="Next Page" onClick={nextPage} disabled={!nextButton}
        className={nextButton ? utilStyles.round: utilStyles.disabledRound}>&#8250;
      </button>
    </div>
  )
}