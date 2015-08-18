class Step < ActiveRecord::Base
  belongs_to :game
  has_many :decisions, :dependent => :destroy 
  has_many :stakeholder_messages, :dependent => :destroy
end
