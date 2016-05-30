class StepSerializer < ActiveModel::Serializer

  attributes :id, :decision_table, :status_message, :decisions, :x_position, :y_position

  def decision_table
    object.decision_table.to_s
  end

  def decisions
    Decision.where(step_id: object.id)
  end
end
