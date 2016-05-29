class GameSerializer < ActiveModel::Serializer

  attributes :game, :steps

  def game
    object
  end

  def steps
    step_array = []
    object.steps.each do |step|
      current_step = StepSerializer.new(step).attributes
      step_array << current_step
    end

    step_array
  end
end
