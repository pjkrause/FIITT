class Game < ActiveRecord::Base
  has_many :steps
  has_many :decisions
  has_many :outcomes
end
