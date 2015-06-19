class Step < ActiveRecord::Base
  has_many :decisions, :dependent => :destroy 
  has_many :stakeholder_messages, :dependent => :destroy
end
