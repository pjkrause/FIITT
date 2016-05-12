class ReportPdf < Prawn::Document

  def initialize(status)
    super(top_margin: 80)
    @status = status
    report_title
    report_author_and_date
    move_down 12
    font_size 10
    data = [["Day", "Status Message", "Decision Options", "Your Choices", "Guidance"]]
    status.trace.each do |key, value|
      step = Step.find(value.split(',').last.split(']').first.to_i)
      decision_choices = ""
      my_choices = ""
      step.decisions.each {|decision| decision_choices += decision.choice + "\n\n"}
      if value then
        intermediate = value.split('[[')[1]
        if intermediate != nil then
          my_choices_ids = intermediate.split('],')[0].split(', ').map{|i| i.to_i}
          my_choices_ids.each do |id|
            my_choices += Decision.find(id).choice + "\n\n" if id != 0
          end
        end
      end
      
      data << [key, step.status_message, decision_choices, my_choices, step.guidance] #
      # step.status_message, step.decisions, decision_choices, step.guidance]
    end

    i=0
    l = data.length
    data.each do |datum|
      i += 1
      if i < l then
        datum[3] = data[i][3]
      else
        datum[3] = ""
      end
    end
    t = make_table(data, header: :true, :column_widths => [30, 150, 120, 120, 120]) do
      row(0).font_style = :bold
      column(0).align = :center
    end
    t.draw
  end

  def report_title
    text "SIMULATION REPORT: #{Game.find(@status.game_id).title}", size: 15, style: :bold, align: :center
  end

  def report_author_and_date
    text "For Player: #{Player.find(@status.player_id).email}. Simulation completed at #{@status.updated_at}"
  end


  def indicator_data
    data = [["Day", "Status Message", "Decision Options", "Your Choices", "Guidance"]]
    decision_choices = []  
    @status.trace.each do |key, value|
      step = Step.find(value.split(',').last.split(']').first.to_i)
      data << [key.to_i, step.status_message, step.decisions, decision_choices, step.guidance]
    end
    return data
  end

end