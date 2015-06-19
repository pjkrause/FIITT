json.array!(@decisions) do |decision|
  json.extract! decision, :id, :choice, :rt, :ec, :ic, :mp, :pp, :days, :next_step, :step_id
  json.url decision_url(decision, format: :json)
end
