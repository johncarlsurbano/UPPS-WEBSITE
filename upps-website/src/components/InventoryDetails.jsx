  import Button from '../components/Button.jsx';

  export const InventoryDetails = ({ inventoryDetails, onHandValue, isEditing, handleEdit, handleSave, handleOnHandChange, cancelEdit, handleDelete, priceValue, handlePriceChange}) => {
    const paperDetails = inventoryDetails?.paper_type;

    const  formatDate = inventoryDetails.updated_at.replace("T", " ").substring(0,19);

    return {
      "Item Name": paperDetails ? paperDetails.paper_type : "N/A",
      "Item ID": paperDetails ? paperDetails.id : "N/A",
      Category: "Paper",
      "On-Hand": isEditing ? (
        <input
          type="number"
          value={onHandValue}
          onChange={(e) => handleOnHandChange(e.target.value)}
          className=" border border-gray-300 rounded w-[5rem]"
        />
      ) : (
        inventoryDetails?.onHand || "N/A"
      ),
      Price: isEditing ? (
        <input
          type="number"
          value={priceValue}
          onChange={(e) => handlePriceChange(e.target.value)}
          className=" border border-gray-300 rounded w-[5rem]"
        />
      ) : (
        paperDetails ? paperDetails.price : "N/A"
      ),
      Updated: formatDate || "N/A",
      Status: inventoryDetails?.status || "N/A",
      Action: (
        <div className="flex gap-3">
          <Button
            title={isEditing ? "Save" : "Edit"}
            style={
              isEditing
                ? "bg-green-500 text-white rounded-[5px] px-[1rem] py-[0.2rem]"
                : "bg-[#18163a] text-white rounded-[5px] px-[1rem] py-[0.2rem]"
            }
            onClick={isEditing ? () =>  handleSave(inventoryDetails.id, onHandValue, priceValue) : handleEdit}
          ></Button>
          <Button
            title={isEditing ? "Cancel" : "Delete"}
            style={"bg-red-500 text-white rounded-[5px] px-[1rem] py-[0.2rem]"}
            onClick={isEditing ? () => cancelEdit(inventoryDetails.id) : () => handleDelete(inventoryDetails.id)}
          ></Button>
        </div>
      ),
    };
  };
