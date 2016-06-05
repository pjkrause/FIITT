class Outcome < ActiveRecord::Base
  has_one :step, primary_key: :step_id, foreign_key: :id, class: Step
  has_one :outcome_step, primary_key: :outcome_step_id, foreign_key: :id, class: Step
end
