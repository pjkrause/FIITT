class StepSerializer < ActiveModel::Serializer

  attributes :id, :decision_table, :default_step, :status_message, :decisions, :x_position, :y_position

  def decision_table
    step_decision_table = []
    object.decision_table.each do |k,v|
      # remove square bracket characters
      k = k[1..-2]
      decision_ids = k.split(",")
      decision_ids -= ["0"]
      step_decision_table << { decisions: decision_ids, next_step: v }
    end

    return step_decision_table
  end

  def decisions
    step_decisions = []
    object.decision_table.each do |k,v|
      # remove square bracket characters
      k = k[1..-2]
      decision_ids = k.split(",")
      decision_ids -= ["0"]
      Decision.where(id: decision_ids).each do |matched_decision|
        step_decisions << matched_decision
      end
      puts "***"
      puts object.id
      puts step_decisions
    end
    return step_decisions
  end

end
