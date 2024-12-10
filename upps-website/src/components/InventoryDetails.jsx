
import Button from '../components/Button.jsx';

export const InventoryDetails = ({
  inventoryDetails,
  newPaperType,
  isEditing,
  handleEdit,
  handleSave,
  handleOnChangePaperType,
  cancelEdit,
  handleDelete,
}) => {
  const paperDetails = inventoryDetails?.paper_type;

  const formatDate = inventoryDetails.updated_at
    .replace("T", " ")
    .substring(0, 19);

  return {
    "Item Name": isEditing ? (
      <input
        type="text"
        value={newPaperType || ""}
        onChange={(e) => handleOnChangePaperType(e.target.value)}
        className="border border-gray-300 rounded w-[10rem]"
      />
    ) : (
      paperDetails ? paperDetails.paper_type : "N/A"
    ),
    "Item ID": paperDetails ? paperDetails.id : "N/A",
    Category: "Paper",
    "On-Hand": inventoryDetails?.onHand || "N/A",
    Price: paperDetails ? paperDetails.price : "N/A",
    Updated: formatDate || "N/A",
    Status: inventoryDetails?.status || "N/A",
    Action: (
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <Button
              title="Save"
              style="bg-[#6fb84c] text-white rounded-[5px] px-[1rem] py-[0.2rem]"
              onClick={() => handleSave(inventoryDetails.id, newPaperType)}
            />
            <Button
              title="Cancel"
              style="bg-[#d9534f] text-white rounded-[5px] px-[1rem] py-[0.2rem]"
              onClick={cancelEdit}
            />
          </>
        ) : (
          <Button
            title="Edit"
            style="bg-[#18163a] text-white rounded-[5px] px-[1rem] py-[0.2rem]"
            onClick={() => handleEdit(inventoryDetails.id, paperDetails.paper_type)}
          />
        )}
      </div>
    ),
  };
};
