import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export type ExportColumn = {
  header: string;
  dataKey: string;
  width?: number;
};

export type ExportOptions = {
  title: string;
  columns: ExportColumn[];
  data: any[];
  filename?: string;
  orientation?: "portrait" | "landscape";
};

// Create hidden HTML table element for rendering
function createTableElement(title: string, columns: ExportColumn[], data: any[]): HTMLElement {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.padding = "20px";
  container.style.backgroundColor = "white";
  container.style.fontFamily = "Arial, sans-serif";

  const titleElement = document.createElement("h1");
  titleElement.style.fontSize = "24px";
  titleElement.style.marginBottom = "10px";
  titleElement.textContent = title;
  container.appendChild(titleElement);

  const dateElement = document.createElement("p");
  dateElement.style.fontSize = "14px";
  dateElement.style.marginBottom = "20px";
  dateElement.textContent = `Generated: ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`;
  container.appendChild(dateElement);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #ddd";

  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.style.backgroundColor = "#1279C3";
  headerRow.style.color = "white";

  columns.forEach((col) => {
    const th = document.createElement("th");
    th.style.padding = "10px";
    th.style.textAlign = "left";
    th.style.border = "1px solid #ddd";
    th.style.fontSize = "14px";
    th.style.fontWeight = "bold";
    th.textContent = col.header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement("tbody");
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    if (index % 2 === 1) {
      tr.style.backgroundColor = "#f5f5f5";
    }

    columns.forEach((col) => {
      const td = document.createElement("td");
      td.style.padding = "8px";
      td.style.border = "1px solid #ddd";
      td.style.fontSize = "13px";

      const value = row[col.dataKey];
      if (value === null || value === undefined) {
        td.textContent = "";
      } else if (typeof value === "number") {
        td.textContent = value.toLocaleString("en-US");
      } else {
        td.textContent = String(value);
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);

  document.body.appendChild(container);
  return container;
}

export async function exportToPDF({
  title,
  columns,
  data,
  filename,
  orientation = "portrait"
}: ExportOptions) {
  // Create hidden table
  const tableElement = createTableElement(title, columns, data);

  try {
    // Render table as canvas
    const canvas = await html2canvas(tableElement, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    // Add image to PDF (with pagination if needed)
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const finalFilename =
      filename || `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;
    pdf.save(finalFilename);
  } finally {
    // Clean up
    document.body.removeChild(tableElement);
  }
}
