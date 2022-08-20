class UpdateCompletedDefaultToFalseTodos < ActiveRecord::Migration[7.0]
  def change
    change_column_default :todos, :completed, from: nil, to: false
  end
end
