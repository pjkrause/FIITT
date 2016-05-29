class StepSerializer < ActiveModel::Serializer

  attributes :id, :decision_table, :status_message, :decisions

  def decisions
    Decision.where(step_id: object.id)
  end
end
