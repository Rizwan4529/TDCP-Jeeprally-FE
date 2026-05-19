import { formatStageLocationRoute } from "../rallyStages.utils.js";

function StageCheckpointsEmptyCard({ stage }) {
  const routeLabel = formatStageLocationRoute(stage);
  const description = stage?.stage_description?.trim();

  return (
    <div className="rm-stage-empty-card" role="status" aria-live="polite">
      <h2 className="rm-stage-empty-card-route">{routeLabel}</h2>
      <div className="rm-stage-empty-card-divider" aria-hidden />
      {description ? (
        <p className="rm-stage-empty-card-description">{description}</p>
      ) : (
        <p className="rm-stage-empty-card-description rm-stage-empty-card-description--muted">
          No stage description has been added yet.
        </p>
      )}
      <span className="rm-stage-empty-card-dot" aria-hidden />
    </div>
  );
}

export default StageCheckpointsEmptyCard;
