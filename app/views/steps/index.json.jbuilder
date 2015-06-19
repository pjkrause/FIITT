json.array!(@steps) do |step|
  json.extract! step, :id, :general_message, :status_message
  json.url step_url(step, format: :json)
end
