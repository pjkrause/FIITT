json.array!(@stakeholder_messages) do |stakeholder_message|
  json.extract! stakeholder_message, :id, :step_id, :source, :message
  json.url stakeholder_message_url(stakeholder_message, format: :json)
end
