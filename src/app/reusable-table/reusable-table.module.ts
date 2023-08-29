import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReusableTableRoutingModule } from "./reusable-table-routing.module";
import { TableComponent } from "./table.component";
import { TableLayoutComponent } from "./ui/table-layout.component";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [TableComponent, TableLayoutComponent],
  imports: [CommonModule, ReusableTableRoutingModule, MaterialModule],
})
export class ReusableTableModule {}
