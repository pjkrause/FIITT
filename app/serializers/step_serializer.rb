class StepSerializer < ActiveModel::Serializer

  attributes :id, :decision_table, :default_step, :status_message, :decisions, :x_position, :y_position

  def decision_table
    step_decision_table = []
    object.outcomes.each do |outcome|
      # remove square bracket characters
      step_decision_table << { id: outcome.id, step: outcome.step.id, decision_ids: outcome.decision_ids, outcome: outcome.outcome_step.id }
    end

    return step_decision_table
  end

  def decisions
    step_decisions = []
    object.outcomes.each do |outcome|
      Decision.where(id: outcome.decision_ids).each do |matched_decision|
        step_decisions << matched_decision unless step_decisions.include?(matched_decision)
      end
    end
    return step_decisions
  end

end
